#!/bin/bash
set -e

# Variables
NAMESPACE="smartfalleh"
BUILD_NUMBER="$1"
DOCKER_REGISTRY="doffy01"

# Vérifier le paramètre
if [ -z "$BUILD_NUMBER" ]; then
    echo "❌ Usage: $0 <BUILD_NUMBER>"
    exit 1
fi

echo " Déploiement sur Kubernetes avec build #${BUILD_NUMBER}"

# Vérifier Minikube
echo " Vérification de Minikube..."
if ! minikube status >/dev/null 2>&1; then
    echo "❌ Minikube n'est pas démarré"
    echo "⚠️  Démarrage de Minikube..."
    minikube start --memory=4096 --cpus=2 --driver=docker
    minikube addons enable ingress
fi

# Activer le docker daemon de Minikube
echo " Utilisation du docker daemon de Minikube..."
eval $(minikube docker-env)

# Construire les images localement pour Minikube
echo " Construction des images Docker localement..."

# Variables d'environnement (à adapter selon votre configuration)
export NODE_ENV="production"
export PORT="3000"
export DB_HOST="mysql-service"
export DB_PORT="3306"
export DB_USERNAME="root"
export DB_DATABASE="smartfallah"
export FRONT_URL="http://smartfalleh.local"
export REACT_APP_API_URL="http://smartfalleh.local/api"
export EMAIL_USER="ssmartfallah@gmail.com"
export USE_ETHEREAL="false"
export SMTP_HOST="smtp.gmail.com"
export SMTP_PORT="587"
export SMTP_USER="ssmartfallah@gmail.com"
export SMTP_FROM="SmartFalleh <ssmartfallah@gmail.com>"
export JWT_EXPIRES_IN="1h"

# Backend
echo " Construction de l'image backend..."
docker build -t ${DOCKER_REGISTRY}/smartfalleh:backend-${BUILD_NUMBER} \
  --build-arg NODE_ENV=${NODE_ENV} \
  --build-arg PORT=${PORT} \
  --build-arg DB_HOST=${DB_HOST} \
  --build-arg DB_PORT=${DB_PORT} \
  --build-arg DB_USERNAME=${DB_USERNAME} \
  --build-arg DB_DATABASE=${DB_DATABASE} \
  --build-arg FRONT_URL=${FRONT_URL} \
  --build-arg EMAIL_USER=${EMAIL_USER} \
  --build-arg SMTP_HOST=${SMTP_HOST} \
  --build-arg SMTP_PORT=${SMTP_PORT} \
  --build-arg SMTP_USER=${SMTP_USER} \
  --build-arg SMTP_FROM="${SMTP_FROM}" \
  --build-arg JWT_EXPIRES_IN=${JWT_EXPIRES_IN} \
  -f backend/Dockerfile ./backend || { echo "❌ Échec construction backend"; exit 1; }

# Frontend
echo " Construction de l'image frontend..."
docker build -t ${DOCKER_REGISTRY}/smartfalleh:frontend-${BUILD_NUMBER} \
  --build-arg REACT_APP_API_URL=${REACT_APP_API_URL} \
  -f frontend/Dockerfile ./frontend || { echo "❌ Échec construction frontend"; exit 1; }

# Créer le namespace si nécessaire
echo " Création du namespace..."
kubectl create namespace ${NAMESPACE} 2>/dev/null || true

# Remplacer les variables dans les fichiers YAML
echo "Préparation des fichiers Kubernetes..."
mkdir -p k8s/tmp

# Fonction pour remplacer les variables
process_yaml() {
  local input_file=$1
  local output_file=$2
  if [ ! -f "$input_file" ]; then
    echo "⚠️  Fichier non trouvé: $input_file"
    return 1
  fi
  sed "s/\${BUILD_NUMBER}/${BUILD_NUMBER}/g; s/\${DOCKER_REGISTRY}/${DOCKER_REGISTRY}/g; s/\${NAMESPACE}/${NAMESPACE}/g" \
    "${input_file}" > "${output_file}"
}

# Traiter chaque fichier
for yaml_file in k8s/*.yaml; do
  if [ -f "$yaml_file" ]; then
    filename=$(basename "$yaml_file")
    process_yaml "$yaml_file" "k8s/tmp/${filename}"
  fi
done

# Appliquer les configurations
echo " Application des configurations Kubernetes..."
for file in k8s/tmp/*.yaml; do
  if [ -f "$file" ]; then
    echo "Application de $(basename "$file")..."
    kubectl apply -f "$file" || echo "⚠️  Échec application de $(basename "$file")"
  fi
done

# Attendre que les pods soient prêts
echo "Attente du déploiement..."
sleep 20

# Vérifier l'état
echo "Vérification de l'état du déploiement..."
echo "=== PODS ==="
kubectl get pods -n ${NAMESPACE} --no-headers | while read line; do
  echo "  $line"
done

echo "=== SERVICES ==="
kubectl get svc -n ${NAMESPACE}

echo "=== INGRESS ==="
kubectl get ingress -n ${NAMESPACE}

# Obtenir l'IP Minikube
MINIKUBE_IP=$(minikube ip)
echo "IP Minikube: ${MINIKUBE_IP}"

# Mettre à jour le hosts local (Linux/Mac)
echo "Mise à jour du fichier hosts..."
if [ -f /etc/hosts ]; then
  if grep -q "smartfalleh.local" /etc/hosts; then
    sudo sed -i.bak "/smartfalleh.local/d" /etc/hosts
  fi
  echo "${MINIKUBE_IP} smartfalleh.local" | sudo tee -a /etc/hosts
  echo "✅ /etc/hosts mis à jour"
else
  echo "⚠️  /etc/hosts non trouvé, mise à jour manuelle nécessaire"
  echo "   Ajoutez cette ligne à votre fichier hosts:"
  echo "   ${MINIKUBE_IP} smartfalleh.local"
fi

# Attendre que l'application soit prête
echo "Attente que l'application soit prête..."
sleep 30

# Test initial
echo "Test initial de l'application..."
if curl -s -f http://smartfalleh.local > /dev/null; then
  echo "✅ Application accessible"
else
  echo "⚠️  Application non encore accessible, vérifiez les logs"
  kubectl get pods -n ${NAMESPACE}
fi

echo "✅ Déploiement terminé !"
echo "🌍 Accédez à: http://smartfalleh.local"
echo "🔧 Backend API: http://smartfalleh.local/api"
echo ""
echo "📋 Commandes utiles:"
echo "   kubectl get all -n ${NAMESPACE}"
echo "   kubectl logs -n ${NAMESPACE} -l app=backend --tail=50"
echo "   minikube dashboard"
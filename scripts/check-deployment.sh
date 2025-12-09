#!/bin/bash
set -e

NAMESPACE="smartfalleh"
HOST="smartfalleh.local"

echo "Vérification du déploiement SmartFalleh..."

echo " 1. Namespace ${NAMESPACE}:"
kubectl get ns ${NAMESPACE} 2>/dev/null || { echo "❌ Namespace non trouvé"; exit 1; }

echo ""
echo " 2. Pods:"
if kubectl get pods -n ${NAMESPACE} --no-headers 2>/dev/null | grep -q "."; then
  kubectl get pods -n ${NAMESPACE} -o wide
  echo ""
  echo " État détaillé:"
  kubectl get pods -n ${NAMESPACE} -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.phase}{"\t"}{.status.containerStatuses[0].ready}{"\n"}{end}' || true
else
  echo "  Aucun pod trouvé"
fi

echo ""
echo " 3. Services:"
kubectl get svc -n ${NAMESPACE} || echo "⚠️  Aucun service trouvé"

echo ""
echo " 4. Ingress:"
INGRESS_INFO=$(kubectl get ingress -n ${NAMESPACE} 2>/dev/null || echo "N/A")
if [ "$INGRESS_INFO" != "N/A" ]; then
  echo "$INGRESS_INFO"
else
  echo " Ingress non trouvé"
fi

echo ""
echo "5. ConfigMaps:"
kubectl get configmap -n ${NAMESPACE} 2>/dev/null || echo "⚠️  Aucun ConfigMap trouvé"

echo ""
echo "6. Secrets:"
kubectl get secret -n ${NAMESPACE} 2>/dev/null || echo "⚠️  Aucun Secret trouvé"

echo ""
echo "7. Événements récents:"
kubectl get events -n ${NAMESPACE} --sort-by=.metadata.creationTimestamp 2>/dev/null | tail -10 || echo "⚠️  Aucun événement trouvé"

echo ""
echo "8. Logs des applications:"
echo "   Backend:"
kubectl logs -n ${NAMESPACE} -l app=backend --tail=5 2>/dev/null || echo "     ❌ Pas de logs backend"
echo ""
echo "   Frontend:"
kubectl logs -n ${NAMESPACE} -l app=frontend --tail=5 2>/dev/null || echo "     ❌ Pas de logs frontend"
echo ""
echo "   MySQL:"
kubectl logs -n ${NAMESPACE} -l app=mysql --tail=5 2>/dev/null || echo "     ❌ Pas de logs MySQL"

echo ""
echo "9. Test de connectivité:"
# Vérifier l'IP Minikube
MINIKUBE_IP=$(minikube ip 2>/dev/null || echo "N/A")
echo "   Minikube IP: ${MINIKUBE_IP}"

# Vérifier DNS
if [ "$MINIKUBE_IP" != "N/A" ]; then
  echo "   Test DNS pour ${HOST}:"
  if ping -c 1 -W 2 ${HOST} >/dev/null 2>&1; then
    echo "   ✅ DNS résolu correctement"
  else
    echo "   ⚠️  DNS non résolu, vérifiez /etc/hosts"
    echo "   Ajoutez: ${MINIKUBE_IP} ${HOST}"
  fi
fi

# Test HTTP
echo "   Test HTTP sur ${HOST}:"
MAX_RETRIES=3
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if curl -s -f http://${HOST} >/dev/null 2>&1; then
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://${HOST})
    echo "   ✅ HTTP ${HTTP_STATUS} - Application accessible"
    break
  else
    RETRY_COUNT=$((RETRY_COUNT+1))
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
      echo " Application non accessible après $MAX_RETRIES tentatives"
    else
      echo " Tentative $RETRY_COUNT/$MAX_RETRIES échouée, nouvelle tentative dans 5s..."
      sleep 5
    fi
  fi
done

echo ""
echo " 10. Résumé des ressources:"
echo "   CPU/Mémoire utilisés:"
kubectl top pods -n ${NAMESPACE} 2>/dev/null || echo "     ⚠️  Metrics non disponibles"

echo ""
echo "=========================================="
echo "✅ Vérification terminée"
echo ""
echo "🔧 Commandes de débogage:"
echo "   kubectl describe pods -n ${NAMESPACE}"
echo "   kubectl logs -n ${NAMESPACE} --all-containers=true --tail=100"
echo "   kubectl get events -n ${NAMESPACE} --sort-by='.lastTimestamp'"
echo ""
echo "🌍 URLs:"
echo "   Application: http://${HOST}"
echo "   API: http://${HOST}/api"
echo "   Santé API: http://${HOST}/api/health"
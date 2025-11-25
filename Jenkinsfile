pipeline {
    agent any
    
    tools {
        nodejs 'node22' 
        dockerTool 'docker'
    }
    
    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }
    
    environment {
        DATABASE_URL = 'mysql://root:root@localhost:3306/smartfallah'
        JWT_SECRET = credentials('jwt_key')
        REACT_APP_API_URL = 'http://localhost:3001'

        // docker 
        DOCKER_REGISTRY = 'doffy01'
        DOCKER_IMAGE_BACKEND = 'smartfalleh-backend'
        DOCKER_IMAGE_FRONTEND = 'smartfalleh-frontend'
        DOCKER_TAG = "${env.BUILD_NUMBER}"

        // testrail env var
        TESTRAIL_URL = 'https://smartfalleh.testrail.io'
        TESTRAIL_PROJECT_ID = '1'
        TESTRAIL_SUITE_ID = '1'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Verify Node.js Installation') {
            steps {
                sh '''
                    echo "=== Node.js Version ==="
                    node --version
                    echo "=== npm Version ==="
                    npm --version
                    echo "=== Project Structure ==="
                    ls -la
                '''
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            sh 'npm install'
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            sh 'npm install'
                        }
                    }
                }
            }
        }
        
        stage('Lint and Code Quality') {
            parallel {
                stage('Backend Lint') {
                    steps {
                        dir('backend') {
                            sh 'npm run lint || echo "Linting failed or not configured"'
                        }
                    }
                }
                stage('Frontend Lint') {
                    steps {
                        dir('frontend') {
                            sh 'npm run lint || echo "Linting failed or not configured"'
                        }
                    }
                }
            }
        }

        // TestRail integration
        stage('Run Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            script {
                                withCredentials([usernamePassword(
                                    credentialsId: 'jenkins_testrail',
                                    usernameVariable: 'TESTRAIL_USER',
                                    passwordVariable: 'TESTRAIL_API_KEY'
                                )]) {
                                    // Simple TestRail test first
                                    sh '''
                                        echo "Testing TestRail connection..."
                                        curl -s -X GET \
                                          -H "Content-Type: application/json" \
                                          -u "$TESTRAIL_USER:$TESTRAIL_API_KEY" \
                                          "$TESTRAIL_URL/index.php?/api/v2/get_projects" \
                                          && echo "✅ TestRail connection successful!" \
                                          || echo "❌ TestRail connection failed - but continuing build"
                                    '''
                                    
                                    // Run tests
                                    sh 'npm test -- --watchAll=false --passWithNoTests || echo "Backend tests failed or no tests"'
                                }
                            }
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        dir('frontend') {
                            sh 'npm test -- --watchAll=false --passWithNoTests || echo "Frontend tests failed or no tests"'
                        }
                    }
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                script {
                    dir('backend') {
                        sh 'npm audit --audit-level=moderate || echo "Backend security vulnerabilities found"'
                    }
                    dir('frontend') {
                        sh 'npm audit --audit-level=moderate || echo "Frontend security vulnerabilities found"'
                    }
                }
            }
        }

        stage('Build Applications') {
            parallel {
                stage('Build Backend') {
                    steps {
                        dir('backend') {
                            sh 'npm run build || echo "Backend build failed or not configured"'
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm run build || echo "Frontend build failed or not configured"'
                        }
                    }
                }
            }
        }
        
        // docjer stages
        stage('Build Docker Images') {
            steps {
                script {
                    // Build and tag backend image
                    docker.build("${env.DOCKER_REGISTRY}/${env.DOCKER_IMAGE_BACKEND}:${env.DOCKER_TAG}", "--build-arg NODE_ENV=production -f backend/Dockerfile ./backend")
                    
                    // Build and tag frontend image
                    docker.build("${env.DOCKER_REGISTRY}/${env.DOCKER_IMAGE_FRONTEND}:${env.DOCKER_TAG}", "-f frontend/Dockerfile ./frontend") 
        
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    // Login to Docker Hub 
                    withCredentials([usernamePassword(
                        credentialsId: 'docker_jenkins',
                        usernameVariable: 'DOCKER_HUB_USER',      
                        passwordVariable: 'DOCKER_HUB_PASSWORD'   
                    )]) {
                        sh "echo ${DOCKER_HUB_PASSWORD} | docker login -u ${DOCKER_HUB_USER} --password-stdin"
                        
                        // Push backend image
                        sh "docker push ${env.DOCKER_REGISTRY}/${env.DOCKER_IMAGE_BACKEND}:${env.DOCKER_TAG}"
                        
                        // Push frontend image
                        sh "docker push ${env.DOCKER_REGISTRY}/${env.DOCKER_IMAGE_FRONTEND}:${env.DOCKER_TAG}"
                        
                        // Optionally, also tag as latest
                        sh "docker tag ${env.DOCKER_REGISTRY}/${env.DOCKER_IMAGE_BACKEND}:${env.DOCKER_TAG} ${env.DOCKER_REGISTRY}/${env.DOCKER_IMAGE_BACKEND}:latest"
                        sh "docker tag ${env.DOCKER_REGISTRY}/${env.DOCKER_IMAGE_FRONTEND}:${env.DOCKER_TAG} ${env.DOCKER_REGISTRY}/${env.DOCKER_IMAGE_FRONTEND}:latest"  // Fixed
                        
                        sh "docker push ${env.DOCKER_REGISTRY}/${env.DOCKER_IMAGE_BACKEND}:latest"
                        sh "docker push ${env.DOCKER_REGISTRY}/${env.DOCKER_IMAGE_FRONTEND}:latest"
                    }
                }
            }
        }
    } 

    post {
        always {
            cleanWs()
            echo "Build completed with status: ${currentBuild.currentResult}"
        }
        success {
            echo "✅ Build successful!"
        }
        failure {
            echo "❌ Build failed! Check the Jenkins console output for details."
        }
    }
}
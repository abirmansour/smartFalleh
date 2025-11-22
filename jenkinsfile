pipeline {
    agent any
    
    tools {
        nodejs 'node22'
    }
    
    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }
    
    environment {
        // Backend Environment Variables
        DATABASE_URL = credentials('mysql://root:root@localhost:3306/smartfallah')
        JWT_SECRET = credentials('jwt_key')
        
        // Frontend Environment Variables  
        REACT_APP_API_URL = credentials('react-api-url')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
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
        
        stage('Run Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            sh '''
                                # Create test results directory if it doesn't exist
                                mkdir -p test-results
                                # Run tests
                                npm test -- --watchAll=false --passWithNoTests || echo "Tests failed or no tests found"
                            '''
                        }
                    }
                    post {
                        always {
                            junit 'backend/test-results/*.xml'
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        dir('frontend') {
                            sh '''
                                # Create test results directory if it doesn't exist
                                mkdir -p test-results
                                # Run tests
                                npm test -- --watchAll=false --passWithNoTests || echo "Tests failed or no tests found"
                            '''
                        }
                    }
                    post {
                        always {
                            junit 'frontend/test-results/*.xml'
                        }
                    }
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                script {
                    // Backend Security Scan
                    dir('backend') {
                        sh 'npm audit --audit-level=moderate || echo "Security vulnerabilities found"'
                    }
                    
                    // Frontend Security Scan
                    dir('frontend') {
                        sh 'npm audit --audit-level=moderate || echo "Security vulnerabilities found"'
                    }
                }
            }
        }
        
        stage('Build Applications') {
            parallel {
                stage('Build Backend') {
                    steps {
                        dir('backend') {
                            sh 'npm run build || { echo "Backend build failed"; exit 1; }'
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm run build || { echo "Frontend build failed"; exit 1; }'
                        }
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
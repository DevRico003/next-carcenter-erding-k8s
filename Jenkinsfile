pipeline {
    agent { label 'agent'}

    stages {
        stage('Clone repository') {
            steps {
                echo 'Start: Cloning repository...'
                checkout scm: [$class: 'GitSCM', branches: [[name: '*/main']], userRemoteConfigs: [[credentialsId: 'github-id', url: 'https://github.com/DevRico003/next-carcenter-erding-k8s.git']]]
                echo 'End: Repository cloned.'
            }
        }

        stage('Build Docker image for Staging') {
            steps {
                script {
                    echo "Building Docker image for Staging with tag: ${env.BUILD_ID}"
                    sh "docker build -f Dockerfile.staging -t devrico003/next-carcenter-erding-k8s-staging:${env.BUILD_ID} ."
                    echo "Tagging Staging image with 'latest'"
                    sh "docker tag devrico003/next-carcenter-erding-k8s-staging:${env.BUILD_ID} devrico003/next-carcenter-erding-k8s-staging:latest"
                }
            }
        }

        stage('Push Staging Docker image to DockerHub') {
            steps {
                script {
                    echo "Pushing Staging Docker image with tag: ${env.BUILD_ID}"
                    sh "docker push devrico003/next-carcenter-erding-k8s-staging:${env.BUILD_ID}"
                    echo "Pushing Staging Docker image with tag: latest"
                    sh "docker push devrico003/next-carcenter-erding-k8s-staging:latest"
                }
            } 
        }

        stage('Deploy to Staging with Kubernetes and Run Tests') {
            steps {
                script {
                    echo "Deploying to Kubernetes staging with image tag: ${env.BUILD_ID}"
                    sh "kubectl set image deployment/next-carcenter-erding-staging nextjs=devrico003/next-carcenter-erding-k8s-staging:${env.BUILD_ID} -n staging"
                    sh "kubectl rollout status deployment/next-carcenter-erding-staging -n staging"
                    
                    echo "Identifying the application pod..."
                    POD_NAME = sh(script: "kubectl get pods -n staging -l app=next-carcenter-erding-staging -o jsonpath='{.items[0].metadata.name}'", returnStdout: true).trim()
                    echo "Running unit tests in pod ${POD_NAME}"
                    try {
                        sh "kubectl exec ${POD_NAME} -n staging -- npm run test --forceExit"
                    } catch (Exception e) {
                        error "Unit tests failed."
                    }
                }
            }
        }

        stage('Build and Push Docker Image for Production') {
            when {
                expression { return currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                script {
                    echo "Building Docker image for Production with tag: ${env.BUILD_ID}"
                    sh "docker build -f Dockerfile.prod -t devrico003/next-carcenter-erding-k8s:${env.BUILD_ID} ."
                    echo "Tagging Production image with 'latest'"
                    sh "docker tag devrico003/next-carcenter-erding-k8s:${env.BUILD_ID} devrico003/next-carcenter-erding-k8s:latest"
                    echo "Pushing Production Docker image with tag: ${env.BUILD_ID}"
                    sh "docker push devrico003/next-carcenter-erding-k8s:${env.BUILD_ID}"
                    echo "Pushing Production Docker image with tag: latest"
                    sh "docker push devrico003/next-carcenter-erding-k8s:latest"
                }
            }
        }

        stage('Deploy to Production with Kubernetes') {
            when {
                expression { return currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                script {
                    echo "Deploying to Kubernetes production with image tag: ${env.BUILD_ID}"
                    sh "kubectl set image deployment/next-carcenter-erding nextjs=devrico003/next-carcenter-erding-k8s:${env.BUILD_ID} -n default"
                    try {
                        sh "kubectl rollout status deployment/next-carcenter-erding -n default"
                    } catch (Exception e) {
                        echo "Deployment failed, starting rollback..."
                        sh "kubectl rollout undo deployment/next-carcenter-erding -n default"
                        error "Deployment failed and rollback was initiated."
                    }
                    
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
    }
}
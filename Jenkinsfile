pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials-id' 
    }

    stages {
        stage('Clone repository') {
            steps {
                echo 'Start: Cloning repository...'
                checkout scm: [$class: 'GitSCM', branches: [[name: '*/main']], userRemoteConfigs: [[credentialsId: 'github-id', url: 'https://github.com/DevRico003/next-carcenter-erding-k8s.git']]]
                echo 'End: Repository cloned.'
            }
        }

        stage('Build Docker image') {
            steps {
                script {
                    echo "Building Docker image with tag: ${env.BUILD_ID}"
                    sh "sudo docker build -t devrico003/next-carcenter-erding-k8s:${env.BUILD_ID} ."
                    echo "Tagging image with 'latest'"
                    sh "sudo docker tag devrico003/next-carcenter-erding-k8s:${env.BUILD_ID} devrico003/next-carcenter-erding-k8s:latest"
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                script {
                    echo 'Logging into DockerHub...'
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                        sh "echo $DOCKERHUB_PASS | sudo docker login -u $DOCKERHUB_USER --password-stdin"
                    }
                    echo "Pushing Docker image with tag: ${env.BUILD_ID}"
                    sh "sudo docker push devrico003/next-carcenter-erding-k8s:${env.BUILD_ID}"
                    echo "Pushing Docker image with tag: latest"
                    sh "sudo docker push devrico003/next-carcenter-erding-k8s:latest"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "Deploying to Kubernetes with image tag: ${env.BUILD_ID}"
                    withCredentials([file(credentialsId: 'kubeconfig-id', variable: 'KUBECONFIG')]) {
                        // Setzen des neuen Images
                        sh "kubectl set image deployment/next-carcenter-erding nextjs=devrico003/next-carcenter-erding-k8s:${env.BUILD_ID} --kubeconfig ${KUBECONFIG} -n default"

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

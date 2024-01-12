pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials-id'  // Ersetzen Sie dies durch die ID Ihrer DockerHub-Credentials in Jenkins
    }

    stages {
        stage('Clone repository') {
            steps {
                checkout scm: [$class: 'GitSCM', branches: [[name: '*/k8s']], userRemoteConfigs: [[credentialsId: 'github-id', url: 'https://github.com/DevRico003/next-cardealer.git']]]
            }
        }

        stage('Build Docker image') {
            steps {
                script {
                    sh "sudo docker build -t devrico003/next-carcenter-erding:${env.BUILD_ID} ."
                    // Taggen des Images mit 'latest'
                    sh "sudo docker tag devrico003/next-carcenter-erding:${env.BUILD_ID} devrico003/next-carcenter-erding:latest"
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                        sh "echo $DOCKERHUB_PASS | sudo docker login -u $DOCKERHUB_USER --password-stdin"
                        sh "sudo docker push devrico003/next-carcenter-erding:${env.BUILD_ID}"
                        sh "sudo docker push devrico003/next-carcenter-erding:latest"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'kubeconfig-id', variable: 'KUBECONFIG')]) {
                        sh "kubectl apply -f k8s/nextjs/deployment-nextjs.yaml --kubeconfig ${KUBECONFIG}"
                    }
                }
            }
        }
    }

    post {
        always {
            // Workspace aufräumen
            cleanWs()
        }
    }
}

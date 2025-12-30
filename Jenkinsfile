pipeline {
    agent any

    tools {
        nodejs 'NodeJs_18' 
    }

    environment {
        DOCKERHUB_REPO = "ayj089/mirrorlit"
        PROJECT_ID = 'opensourcepractice-472707'
        CLUSTER_NAME = 'kube'
        LOCATION = 'asia-northeast3-a'
        CREDENTIALS_ID = '7d038ca9-f331-4f7c-962a-8b2b555dba77'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

    stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKERHUB_REPO}:${env.BUILD_NUMBER} ."
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                script {
                    docker.withRegistry('', '8e658fbd-d431-4660-b69e-00764ad9c016') {     
                        sh "docker push ${DOCKERHUB_REPO}:${BUILD_NUMBER}"
                        sh "docker tag ${DOCKERHUB_REPO}:${BUILD_NUMBER} ${DOCKERHUB_REPO}:latest"
                        sh "docker push ${DOCKERHUB_REPO}:latest"
                    }
                }
            }
        }

        stage('Deploy to GKE') {
            when {
                branch 'master'
            }
            steps {
               sh "sed -i 's|ayj089/mirrorlit:[^ ]*|ayj089/mirrorlit:${env.BUILD_NUMBER}|g' deployment.yaml"
                step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.CLUSTER_NAME, location: env.LOCATION, manifestPattern: 'deployment.yaml', credentialsId: CREDENTIALS_ID, verifyDeployments: true])
            }
        }
    }

    post {
        success { echo "CI 성공" }
        failure { echo "CI 실패" }
    }
}
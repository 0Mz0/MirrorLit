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
        CREDENTIALS_ID = '8e658fbd-d431-4660-b69e-00764ad9c016'
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
        // 1. 어떤 태그가 있든 현재 빌드 번호로 강제 교체
        sh "sed -i 's|ayj089/mirrorlit:[^ ]*|ayj089/mirrorlit:${env.BUILD_ID}|g' deployment.yaml"
        
        // 2. 변경된 매니페스트로 배포
        step([$class: 'KubernetesEngineBuilder', 
              projectId: env.PROJECT_ID, 
              clusterName: env.CLUSTER_NAME, 
              location: env.LOCATION, 
              manifestPattern: 'deployment.yaml', 
              credentialsId: env.CREDENTIALS_ID, 
              verifyDeployments: true])
        
        // 3. 배포된 팟(Pod)들이 새 이미지를 즉시 사용하도록 재시작 트리거
        sh "kubectl rollout restart deployment/mirrorlit-deploy"
    }
        }
    }

    post {
        success { echo "CI 성공" }
        failure { echo "CI 실패" }
    }
}
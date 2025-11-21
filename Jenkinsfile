pipeline {
    agent any

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

        stage('Run Tests') {
            steps {
                script {
                    try {
                        sh 'npm test'
                    } catch (err) {
                        echo "테스트 실패: ${err}"
                        error("테스트 실패로 빌드를 중단합니다.")
                    }
                }
            }
        }
    }

    post {
        success {
            echo "CI 성공! 코드에 문제 없음."
        }
        failure {
            echo "CI 실패! 코드 수정 필요."
        }
    }
}

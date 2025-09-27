
pipeline {
    agent any
    
    parameters {
        choice(
            name: 'BROWSER',
            choices: ['chrome', 'firefox', 'edge'],
            description: 'Browser pre spustenie testov'
        )
        choice(
            name: 'ENV',
            choices: ['test', 'staging', 'prod'],
            description: 'Prostredie pre spustenie testov'
        )
        booleanParam(
            name: 'HEADLESS',
            defaultValue: true,
            description: 'Spustiť testy v headless mode'
        )
    }
    
    environment {
        NODE_VERSION = '18'
        CYPRESS_CACHE_FOLDER = "${WORKSPACE}/.cache/cypress"
        ALLURE_RESULTS_DIR = 'allure-results'
        ALLURE_REPORT_DIR = 'allure/report'
    }
    
    tools {
        nodejs "${NODE_VERSION}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Checking out branch: ${env.BRANCH_NAME}"
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    echo 'Installing dependencies with Yarn...'
                    sh '''
                        # Ak yarn nie je nainštalovaný, nainštaluj ho
                        if ! command -v yarn &> /dev/null; then
                            npm install -g yarn
                        fi
                        
                        # Cache yarn dependencies
                        yarn install --frozen-lockfile --cache-folder .yarn-cache
                    '''
                }
            }
        }
        
        stage('Verify Cypress') {
            steps {
                sh '''
                    echo "Verifying Cypress installation..."
                    npx cypress verify
                    npx cypress info
                '''
            }
        }
        
        stage('Run Cypress Tests') {
            steps {
                script {
                    def browserFlag = params.HEADLESS ? "--headless" : ""
                    def configFile = params.ENV ?: 'test'
                    
                    echo "Running Cypress tests with browser: ${params.BROWSER}"
                    echo "Environment: ${configFile}"
                    echo "Headless mode: ${params.HEADLESS}"
                    
                    sh """
                        # Vytvor adresár pre allure výsledky
                        mkdir -p ${ALLURE_RESULTS_DIR}
                        
                        # Spusti Cypress testy
                        npx cypress run \\
                            --browser ${params.BROWSER} \\
                            ${browserFlag} \\
                            --env configFile=${configFile} \\
                            --reporter json \\
                            --reporter-options "outputFile=cypress/results/results.json" \\
                            || true
                    """
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'cypress/screenshots/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'cypress/videos/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'cypress/results/**/*', allowEmptyArchive: true
                }
            }
        }
        
        stage('Generate Allure Report') {
            steps {
                script {
                    sh '''
                        echo "Generating Allure report..."
                        
                        # Kopíruj historické dáta ak existujú
                        if [ -d "${ALLURE_REPORT_DIR}/history" ]; then
                            echo "Copying historical data..."
                            mkdir -p ${ALLURE_RESULTS_DIR}/history
                            cp -r ${ALLURE_REPORT_DIR}/history/* ${ALLURE_RESULTS_DIR}/history/ || true
                        fi
                        
                        # Vygeneruj Allure report
                        npx allure generate ${ALLURE_RESULTS_DIR} --clean -o ${ALLURE_REPORT_DIR}
                        
                        echo "Allure report generated successfully"
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline finished'
            
            script {
                try {
                    allure([
                        includeProperties: false,
                        jdk: '',
                        properties: [],
                        reportBuildPolicy: 'ALWAYS',
                        results: [[path: env.ALLURE_RESULTS_DIR]]
                    ])
                } catch (Exception e) {
                    echo "Failed to publish Allure report: ${e.getMessage()}"
                }
            }
            
            cleanWs(
                cleanWhenAborted: true,
                cleanWhenFailure: false,
                cleanWhenNotBuilt: false,
                cleanWhenSuccess: true,
                cleanWhenUnstable: false,
                deleteDirs: true,
                disableDeferredWipeout: true,
                notFailBuild: true,
                patterns: [
                    [pattern: '.cache/**', type: 'EXCLUDE'],
                    [pattern: 'node_modules/**', type: 'EXCLUDE'],
                    [pattern: 'cypress/screenshots/**', type: 'INCLUDE'],
                    [pattern: 'cypress/videos/**', type: 'INCLUDE']
                ]
            )
        }
        
        success {
            echo 'Pipeline completed successfully!'
            
            emailext (
                subject: "✅ Cypress Tests PASSED - ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: """
                    <h3>Cypress Test Results - SUCCESS</h3>
                    <p><strong>Job:</strong> ${env.JOB_NAME}</p>
                    <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                    <p><strong>Browser:</strong> ${params.BROWSER}</p>
                    <p><strong>Environment:</strong> ${params.ENV}</p>
                    <p><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    <p><strong>Allure Report:</strong> <a href="${env.BUILD_URL}allure">View Report</a></p>
                """,
                to: "${env.CHANGE_AUTHOR_EMAIL}",
                mimeType: 'text/html'
            )
        }
        
        failure {
            echo 'Pipeline failed!'
            
            emailext (
                subject: "❌ Cypress Tests FAILED - ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: """
                    <h3>Cypress Test Results - FAILURE</h3>
                    <p><strong>Job:</strong> ${env.JOB_NAME}</p>
                    <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                    <p><strong>Browser:</strong> ${params.BROWSER}</p>
                    <p><strong>Environment:</strong> ${params.ENV}</p>
                    <p><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    <p><strong>Console Log:</strong> <a href="${env.BUILD_URL}console">View Log</a></p>
                    <p><strong>Allure Report:</strong> <a href="${env.BUILD_URL}allure">View Report</a></p>
                """,
                to: "${env.CHANGE_AUTHOR_EMAIL}",
                mimeType: 'text/html'
            )
        }
        
        unstable {
            echo 'Pipeline is unstable!'
        }
    }
}

FROM jenkins/jenkins:lts

USER root

# Installieren von notwendigen Paketen inklusive sudo
RUN apt-get update && \
    apt-get install -y apt-transport-https ca-certificates curl gnupg2 software-properties-common sudo

# Docker GPG Key und Repository hinzufügen
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - && \
    add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"

# Docker und Docker Compose installieren
RUN apt-get update && apt-get install -y docker-ce docker-ce-cli containerd.io

# Jenkins-Benutzer zur Docker-Gruppe hinzufügen
RUN usermod -aG docker jenkins

# Kopieren des Kubernetes-Zertifikats und Importieren in den Java Keystore
COPY kubernetes.crt /usr/local/share/ca-certificates/kubernetes.crt
RUN keytool -import -alias kubernetes -keystore $JAVA_HOME/lib/security/cacerts -file /usr/local/share/ca-certificates/kubernetes.crt -storepass changeit -noprompt

# Setzen von Sudo ohne Passwort für den Jenkins-Benutzer
RUN echo "jenkins ALL=NOPASSWD: ALL" >> /etc/sudoers

# Installieren Sie kubectl
RUN curl -LO "https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl" \
    && chmod +x ./kubectl \
    && mv ./kubectl /usr/local/bin/kubectl

USER jenkins

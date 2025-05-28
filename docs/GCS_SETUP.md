# 🌐 Configuration Google Cloud Storage pour DataMa Icons

Ce guide vous aide à configurer Google Cloud Storage comme CDN pour les releases des icônes DataMa.

## 🏗️ Prérequis

- Un projet Google Cloud Platform
- Accès administrateur au repository GitHub
- CLI `gcloud` installé (optionnel)

## 📦 Étape 1: Créer le bucket GCS

### Via la console GCP
1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. Naviguez vers **Cloud Storage > Buckets**
3. Cliquez **Create Bucket**
4. Configuration recommandée :
   ```
   Nom: datama-icons-cdn (ou votre choix)
   Région: europe-west1 (ou la plus proche de vos utilisateurs)
   Storage class: Standard
   Access control: Uniform (Bucket-level)
   Public access: Allow (si vous voulez un CDN public)
   ```

### Via CLI
```bash
# Créer le bucket
gsutil mb -p your-project-id -c STANDARD -l europe-west1 gs://datama-icons-cdn

# Activer l'accès public (optionnel)
gsutil iam ch allUsers:objectViewer gs://datama-icons-cdn
```

## 🔐 Étape 2: Créer le Service Account

### Via la console GCP
1. **IAM & Admin > Service Accounts**
2. **Create Service Account**
3. Configuration :
   ```
   Nom: datama-icons-deployer
   Description: Deploy DataMa icons to CDN bucket
   ```
4. **Grant this service account access to project** :
   - `Storage Object Admin` (pour le bucket spécifique)
   - ou `Storage Admin` (plus large)

### Via CLI
```bash
# Créer le service account
gcloud iam service-accounts create datama-icons-deployer \
    --description="Deploy DataMa icons to CDN bucket" \
    --display-name="DataMa Icons Deployer"

# Assigner les permissions
gcloud projects add-iam-policy-binding your-project-id \
    --member="serviceAccount:datama-icons-deployer@your-project-id.iam.gserviceaccount.com" \
    --role="roles/storage.objectAdmin"

# Créer et télécharger la clé
gcloud iam service-accounts keys create datama-icons-key.json \
    --iam-account=datama-icons-deployer@your-project-id.iam.gserviceaccount.com
```

## 🎯 Étape 3: Configurer les permissions du bucket

```bash
# Permissions spécifiques au bucket (plus sécurisé)
gsutil iam ch serviceAccount:datama-icons-deployer@your-project-id.iam.gserviceaccount.com:objectAdmin gs://datama-icons-cdn

# Si vous voulez un accès public en lecture
gsutil iam ch allUsers:objectViewer gs://datama-icons-cdn
```

## 🔑 Étape 4: Configurer les secrets GitHub

Allez dans votre repository GitHub > **Settings > Secrets and variables > Actions**

### Secrets requis :

#### `GCP_SERVICE_ACCOUNT_KEY`
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "datama-icons-deployer@your-project-id.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

#### `GCS_BUCKET`
```
datama-icons-cdn
```

#### `GCS_CDN_URL`
```
https://storage.googleapis.com/datama-icons-cdn
```

## 🌍 Étape 5: (Optionnel) Configurer un CDN custom

### Avec Cloud CDN
```bash
# Créer un load balancer avec Cloud CDN
# (Processus complexe, consultez la documentation GCP)
```

### Avec Cloudflare
1. Ajouter votre domaine à Cloudflare
2. Créer un enregistrement CNAME :
   ```
   cdn.datama.io → datama-icons-cdn.storage.googleapis.com
   ```
3. Activer le cache et la compression
4. Mettre à jour `GCS_CDN_URL` vers `https://cdn.datama.io`

## 🧪 Étape 6: Tester la configuration

### Test local avec gsutil
```bash
# Test d'upload
echo "test" > test.txt
gsutil cp test.txt gs://datama-icons-cdn/test/
gsutil rm gs://datama-icons-cdn/test/test.txt

# Test des headers de cache
gsutil setmeta -h "Cache-Control:public,max-age=3600" gs://datama-icons-cdn/test.txt
```

### Test via GitHub Actions
Créez un tag de test :
```bash
git tag v0.0.1-test
git push origin v0.0.1-test
```

Vérifiez les logs dans GitHub Actions.

## 📊 Structure finale du bucket

Après une release réussie, votre bucket aura cette structure :

```
gs://datama-icons-cdn/
├── latest/
│   ├── icons.js
│   ├── icons.json
│   ├── dist/
│   │   ├── index.js
│   │   ├── index.esm.js
│   │   ├── vue/
│   │   └── ...
│   ├── package.json
│   ├── README.md
│   └── version.json
├── releases/
│   ├── 1.0.0/
│   │   └── [même structure que latest]
│   └── 1.0.1/
└── archives/
    ├── datama-icons-1.0.0.zip
    └── datama-icons-1.0.1.tar.gz
```

## 🔍 URLs d'accès

### Fichiers de base
```
https://storage.googleapis.com/datama-icons-cdn/latest/icons.js
https://storage.googleapis.com/datama-icons-cdn/latest/icons.json
https://storage.googleapis.com/datama-icons-cdn/latest/version.json
```

### Composants Vue
```
https://storage.googleapis.com/datama-icons-cdn/latest/dist/vue/index.js
https://storage.googleapis.com/datama-icons-cdn/latest/dist/vue/index-simple.js
```

### Versions spécifiques
```
https://storage.googleapis.com/datama-icons-cdn/releases/1.0.1/icons.js
```

## 🛠️ Maintenance

### Nettoyer les anciennes versions
```bash
# Supprimer les versions anciennes (garder les 5 dernières)
gsutil ls gs://datama-icons-cdn/releases/ | head -n -5 | xargs gsutil -m rm -r

# Nettoyer les archives anciennes
gsutil ls gs://datama-icons-cdn/archives/ | grep -E "datama-icons-[0-9]" | head -n -10 | xargs gsutil rm
```

### Monitoring des coûts
- Configurez des alertes de budget dans GCP
- Utilisez Cloud Monitoring pour surveiller l'utilisation

### CORS (si nécessaire)
Si vous devez accéder aux fichiers depuis le navigateur :

```bash
# Créer cors.json
cat > cors.json << EOF
[
    {
      "origin": ["*"],
      "method": ["GET"],
      "responseHeader": ["Content-Type"],
      "maxAgeSeconds": 3600
    }
]
EOF

# Appliquer la configuration CORS
gsutil cors set cors.json gs://datama-icons-cdn
``` 
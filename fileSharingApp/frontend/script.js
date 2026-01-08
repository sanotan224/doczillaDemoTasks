let selectedFile = null;

const fileInput = document.getElementById('file-input');
const fileInfo = document.getElementById('file-info');
const uploadBtn = document.getElementById('upload-btn');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const resultDiv = document.getElementById('result');
const downloadLink = document.getElementById('download-link');

fileInput.addEventListener('change', function() {
    handleFiles(this.files);
});

resetUpload();

function handleFiles(files) {
    if (files.length > 0) {
        selectedFile = files[0];
        displayFileInfo(selectedFile);
        uploadBtn.classList.remove('hidden');
        resultDiv.classList.add('hidden');
    }
}

function displayFileInfo(file) {
    const size = formatFileSize(file.size);
    fileInfo.innerHTML = `
        <h4>${file.name}</h4>
        <p>Size: ${size}</p>
        <p>Type: ${file.type || 'Unknown'}</p>
    `;
    fileInfo.classList.remove('hidden');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function uploadFile() {
    if (!selectedFile) {
        alert('Please select a file first');
        return;
    }

    if (!authToken) {
        alert('Please login first');
        return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    uploadBtn.disabled = true;
    progressContainer.classList.remove('hidden');
    progressBar.style.width = '0%';
    progressText.textContent = '0%';

    try {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percentComplete = Math.round((e.loaded / e.total) * 100);
                progressBar.style.width = percentComplete + '%';
                progressText.textContent = percentComplete + '%';
            }
        });

        xhr.addEventListener('load', () => {
            if (xhr.status === 201) {
                const data = JSON.parse(xhr.responseText);
                showResult(data);
            } else {
                const error = JSON.parse(xhr.responseText);
                alert(error.error || 'Upload failed');
                resetUpload();
            }
        });

        xhr.addEventListener('error', () => {
            alert('Upload failed. Please try again.');
            resetUpload();
        });

        xhr.open('POST', `${API_URL}/files/upload`);
        xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
        xhr.send(formData);

    } catch (error) {
        console.error('Upload error:', error);
        alert('Upload failed');
        resetUpload();
    }
}

function showResult(data) {
    resultDiv.classList.remove('hidden');
    downloadLink.value = data.downloadUrl;
    uploadBtn.classList.add('hidden');
    progressContainer.classList.add('hidden');
    fileInfo.classList.add('hidden');

    selectedFile = null;
    uploadBtn.disabled = false;
}

function resetUpload() {
    uploadBtn.disabled = false;
    progressContainer.classList.add('hidden');
    fileInfo.classList.add('hidden');
    selectedFile = null;
}

function copyLink() {
    downloadLink.select();
    document.execCommand('copy');

    const copyBtn = document.querySelector('.link-container button');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    copyBtn.style.background = '#10b981';

    setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = '';
    }, 2000);
}

async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/stats/overall`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const stats = await response.json();
            displayStats(stats);
        } else {
            alert('Failed to load statistics');
        }
    } catch (error) {
        console.error('Stats error:', error);
        alert('Connection error');
    }
}

function displayStats(stats) {
    const container = document.getElementById('stats-container');
    const statsCards = new Map([
        ['My Files', stats.activeFiles ?? 0],
        ['Total Downloads', stats.totalDownloads ?? 0],
        ['Total Size', formatFileSize(stats.totalSize ?? 0)]
    ]);

    container.innerHTML = Array.from(statsCards.entries()).map(([key, value]) => `
        <div class="stat-card">
            <h3>${key}</h3>
            <p>${value}</p>
        </div>
    `).join('');
}
// FileUploadService.js
import axios from 'axios';

const uploadFile = async (file, journalId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('journalId', journalId);

    try {
        const response = await axios.post('http://localhost:8097/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

export default {
    uploadFile,
};

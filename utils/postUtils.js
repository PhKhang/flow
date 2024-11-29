import { addPost } from "/server/controller/postController.js";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";
import { randomUUID } from 'crypto';

const s3Client = new S3Client({
  credentials: fromEnv(),
  endpoint: "https://fd0314cb84aca3240521990fc2bb803c.r2.cloudflarestorage.com"
});

const uploadFileToS3 = async (file) => {
  try {
    if (!file || !file.size) {
      throw new Error('No file provided');
    }

    const fileName = `${randomUUID()}-${file.name}`;
    
    const command = new PutObjectCommand({
      Bucket: "poro",
      Key: fileName,
      Body: await file.arrayBuffer(),
    });

    await s3Client.send(command);

    return {
      name: fileName,
      size: file.size,
      url: `https://pub-b62914ea73f14287b50eae850c46299b.r2.dev/${fileName}`,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

const handlePostSubmit = async (formData) => {
  try {
    if (!formData.content || formData.content.trim() === '') {
      throw new Error('Post content cannot be empty');
    }

    const postData = {
      content: formData.content.trim(),
      media: {
        type: formData.image ? 'image' : 'none',
        urls: formData.image ? [formData.image] : []
      },
      author: formData.author || 'Test',
      author_id: formData.authorId || "1"
    };

    const newPost = await addPost(
      postData.author,
      postData.author_id,
      postData.content,
      postData.media
    );

    if (!newPost) {
      throw new Error('Cannot add new post');
    }

    return {
      success: true,
      data: newPost
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

const handleFileUpload = defineEventHandler(async (event) => {
  try {
    const form = await readFormData(event);
    const file = form.get('file');

    if (!file || !file.size) {
      throw createError({
        statusCode: 400,
        message: 'No file provided'
      });
    }

    const uploadResult = await uploadFileToS3(file);
    return uploadResult;
    
  } catch (error) {
    console.error('Error handling file upload:', error);
    throw error;
  }
});

export {
  handlePostSubmit,
  handleFileUpload,
  uploadFileToS3
};
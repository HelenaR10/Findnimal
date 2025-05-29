<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Google\Cloud\Storage\StorageClient;
use Google\Cloud\Storage\Bucket;

class StorageService {
    private StorageClient $storage;
    private Bucket $bucket;

    public function __construct() {
        $this->storage = new StorageClient([
            'projectId' => GOOGLE_CLOUD_PROJECT,
            // 'keyFilePath' => GOOGLE_CLOUD_CREDENTIALS
        ]);
        $this->bucket = $this->storage->bucket(GOOGLE_CLOUD_STORAGE_BUCKET);
    }

    public function uploadFile($fileTmpPath, $fileName, $directory = '') {
        try {
            $objectName = $directory . '/' . $fileName;
            $this->bucket->upload(
                fopen($fileTmpPath, 'r'),
                [
                    'name' => $objectName
                ]
            );
            
            return $this->bucket->object($objectName)->info()['mediaLink'];
        } catch (Exception $e) {
            throw new Exception('Error al subir el archivo a Google Cloud Storage: ' . $e->getMessage());
        }
    }

    public function deleteFile($fileUrl, $directory = '') {
        try {
            // Extraer el nombre del objeto de la URL
            $objectName = basename($fileUrl);
            if ($directory) {
                $objectName = $directory . '/' . $objectName;
            }
            
            $object = $this->bucket->object($objectName);
            if ($object->exists()) {
                $object->delete();
            }
            return true;
        } catch (Exception $e) {
            throw new Exception('Error al eliminar el archivo de Google Cloud Storage: ' . $e->getMessage());
        }
    }

    public function getFileUrl($fileName, $directory = '') {
        $objectName = $directory . '/' . $fileName;
        return $this->bucket->object($objectName)->info()['mediaLink'];
    }
} 
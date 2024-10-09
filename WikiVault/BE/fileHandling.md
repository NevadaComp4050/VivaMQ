# Backend File Handling

**Requirements**
1. Files shall be linked with the uploader.
2. Files shall be optionally linked with a db entity.
   1. Viva-Question: AI-output Format
      - [ ] AI -> FE transformation
   2. Submission: Accepted upload format
      - [x] pdf
      - [ ] zip
      - [ ] misc
3. Files shall be accessible via a BE service for BE.processes.
4. Files shall be tracked by the database.

## Uploads/
MVP solution is to store files to an uploads folder.
- There is a simple POST / GET API for frontend

### Usage
Command line usage / API endpoint
```
curl -F "file=@PATHTOFILE" http://localhost:8080/api/v1/development/files/upload
curl -O http://localhost:8080/api/v1/development/files/download/FILE
```

### BE Usage


## Amazon S3
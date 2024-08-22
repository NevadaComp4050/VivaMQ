## AI Module - API Interfaces and Integration Document

### 1. Overview
#### 1.1 Introduction
Provide a brief introduction to the API, its purpose, and what functionality it provides. 

This document provides a guide to the OpenAI API for the VivaMQ AI Component. The API facilitates the integration of AI with generating Viva questions and quality cheching assessments, into the VivaMQ system. It provides developers with the tools to access AI features, enabling seamless interaction between the Frontend, Backend, and the AI model.

#### 1.2 Audience
Describe the intended audience for this document (e.g., developers, integration engineers).

This document is intended for developers, integration engineers and software architects who are responsible for integrating the AI module with the VivaMQ system.
---

### 2. API Access

#### 2.1 Authentication and Authorization
Explain the methods of authentication and authorization supported by the API.
- **API Key**: Explain how to obtain and use an API key.
- **OAuth 2.0**: Describe the OAuth 2.0 flow supported (e.g., Client Credentials, Authorization Code).

To access the API, an API key is required. An API key can be obtained by registering on the VivaMQ system. The system administrator would then authorize the key with the 'Authorization' header for each request as follows:

Authorization: YOUR_API_KEY

The API supports the OAuth 2.0 authorization framework. Developers must obtain have Client Credentials such as a client_id and receive the Authorization Code from the VivaMQ platform. The flow involves the following steps:
...

#### 2.2 Endpoints

List and describe the primary API endpoints, including base URLs for different environments (e.g., production, staging).
- **Base URL**: `https://api.example.com/`

Primary Endpoint:
- Viva Question Generation:
  - /questions
  - Description: Generates Viva questions based on a student's submission.
- Assessment Quality Check:
  - /assessment
  - Description: Evaluates the quality, relevance, structure, grammer of the submission.
- Marking Rubric:
  - /rubric
  - Description: Creates a marking rubric based on predefined criterias.



#### 2.3 Rate Limiting
Describe any rate limiting applied to the API, including limits and how to handle them.

The API rate limits are as follows:
- 500 requests per minute (RPM)
- 30,000 tokens per day (TPM)

If the API rate limit is hit, the API will return a '429 Too Many Requests' error. 
Developers are advised to implement retry logic with exponential backoff. Retrying with exponential backoff means to perform a short sleep when a rate limit error is encountered, then retrying the unsuccessful request. The process is repeated with an extended sleep duration if the request is still denied. This keeps going until either the request is fullfilled or the allotted amount tries is reached. 

---
### 3. How to Use the API

#### 3.1 Making Requests
Explain how to make a request to the API, including required headers (e.g., Content-Type, Authorization).

All requests to the API should include the following headers:
- Authorization: YOUR_API_KEY
- Content-Type: application/json

Example Request:
```json
POST /questions/generate HTTP/1.1
Host: api.vivamq.com
Authorization: YOUR_API_KEY
Content-Type: application/json
{
    "student_id": 12345
    "description":{
        "grade_level": "Distinction"
        "content": "COMP2050 Data Structures and Algorithms"
    }
}
```

#### 3.2 Handling Responses
Describe the standard structure of API responses, including status codes and format (e.g., JSON, XML).

...

Example of successful response:
```json
{
    "status": "Succuess"
    "data":{
        "questions": [
            "In your SRS, the vision statement mentions the primary goal of improving the user experience for the Bombala project. Can you elaborate on how your proposed system aims to achieve this?"
            "What recommendations did you make in the discussion section, and how are they intended to guide future development?"
        ]
    }
}       
```
#### 3.3 Error Handling
Detail the error codes and messages, their meanings, and recommendations for handling them.

Error codes and their messages:
| Error Code | Message | Meaning | Recommendations for handling them |
| ---------- | ------- | ------- | --------------------------------- |
| 401 | Invalid Authentication | Authentication was invalid | Ensure the correct API key and requesting organization are being used |
| 401 | Incorrect API key provided | The requesting API key is not correct | Ensure the correct API key used is being used, clear your browser cache or generate a new one |
| 401 | You must be a member of an organization to use the API | The account is not part of an organization | Contact VivaMQ system to get added to a new organization or ask your organization manager to invite you to an organization |
| 403 | Country, region, or territory not supported | Accessing the API from an unsupported country, region or territory | Please visit VivaMQ Webpage for a list of supported countries, regions or territories |
| 429 | Rate limit reached for requests | Sending requests too quickly | Pace your requests. Visit the VivaMQ Webpage for a rate limit guide |
| 429 | You exceeded your current quota, please check your plan and billing details | You have run out of credits or hit your maximum monthly spend | Purchase a higher tier of API usage |
| 500 | The server had an error while processing your request | Issue on the server | Retry your request after a brief wait and contact VivaMQ if error persists |
| 503 | The engine is currently overloaded, please try again later | Servers are experiencing high traffic | Retry your request after a brief wait |

---

### 4. Best Practices

#### 4.1 Security
Provide guidelines for securely accessing and using the API.
- Store API keys securely.
- Use HTTPS for all API requests.

#### 4.2 Performance
Tips for optimizing the usage of the API to ensure performance, such as:
- Efficient use of endpoints.
 - Fetch only the data needed to reduce load.
- Handling API rate limits.
 - Implement retries with exponential backoff when rate limits are encounetered. 

#### 4.3 Data Management
Guidance on managing the data retrieved or sent via the API.
- Data validation.
- Data storage best practices.

---

### 5. Technical Details

#### 5.1 Data Models and Schema

##### User
- **ID**: Integer
- **Name**: String
- **Email**: String

##### Item
- **ID**: Integer
- **Name**: String
- **Description**: String
- **Price**: Float

Provide detailed data models/schema for the different resources.

#### 5.2 Sample Use Cases and Code Snippets

##### Use Case: Fetching a List of Users
Provide an example of how to fetch and handle a list of users.
```python
import requests

url = "https://api.example.com/users"
headers = {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)
print(response.json())
```

##### Use Case: Creating a New Item
Provide an example of how to create a new item.
```javascript
const axios = require('axios');

const data = {
    name: "Sample Item",
    description: "This is a sample description",
    price: 19.99
};

axios.post('https://api.example.com/items', data, {
    headers: {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'Content-Type': 'application/json'
    }
})
.then(response => {
    console.log(response.data);
})
.catch(error => {
    console.error(error);
});
```

#### 5.3 Common Issues and Troubleshooting
List common issues developers face while integrating the API and provide troubleshooting tips.

---

### 6. Conclusion

Summarize the document, reinforce the benefits of using the API, and provide links to further resources (e.g., detailed API reference, support contacts).

---

### 7. Appendix

#### 7.1 Glossary
Define any terms and abbreviations used in the document.

#### 7.2 Links and References
Provide links to additional resources, such as:
- Full API Reference
- Developer Forums
- Support Email

---

### 8. Change Log
Document revisions of the API and this document.
- **Version 1.0**: Initial release

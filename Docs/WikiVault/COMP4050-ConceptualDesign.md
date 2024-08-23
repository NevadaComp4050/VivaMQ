# Frontend

# Backend

## Entity Relation model

```mermaid
erDiagram
	User{
		int UserID
		string name
		string email
		hash password
		Role role
	}
	Unit{
		int UnitID
		string name
		int year
		int convenor_id
	}
	Tutor{
		int ID
		string name
		string email
		Unit UnitID
	}
	Student{
		int StuID
		string name
		string email
	}
	Assignment{
		int AssID
		string name
		string AI_model
		string specs
		string settings
		Unit UnitID
	}
	Submission{
		int SubID
		Assignment AssID
		Student StuID
		string submission_file
		string status
	}
	VivaQuestion{
		int VivaID
		Submission SubID
		string question
		string status
	}
	User ||--o{ Unit : manages
	Unit ||--o{ Tutor : has
	Unit ||--o{ Assignment : contains
	Assignment ||--o{ Submission : includes
	Student ||--o{ Submission : submits
	Submission ||--o{ VivaQuestion: generates
```


- Each process particular to backend should be wrapped in buffers
	- Inbox and outbox effectively
	- For bottlenecks more processing power could be allocated to accelerate processing
- Admin controls are needed.
	- [Authentication](Authentication.md) needed [https://authjs.dev/](https://authjs.dev/) recommended.
- [Database](Database.md) needs to be set up [Prisma.io](https://www.prisma.io/) recommended.
- Multiple parallel dataflows will be needed (Different users with different data)

## Pipe and filter model of the Dataflow through the system
### Viva Generation
```mermaid
flowchart TD
	subgraph FrontEnd
		direction LR
		UI --> FE
		UI[Upload UI]
		FE[Front end processing]
		FES[User spec for AI]
	end
	subgraph FrontEndResp
		FEResp[Presentation of output to user]
	end
	subgraph AI
		AIConf[Bandana]
		AIProc[AI Process]
		AIConf -- Config --> AIProc
	end
	Doc2AI[Process document to AI format]
	Cont[Control]
	DB[Storage Database]
	FE -- JSON --> Doc2AI
	Doc2AI -- Document Data --> AIProc
	FES --> Cont
	Cont -- Prompt Type/Class --> AIConf
	AIProc -- Response Data --> DB
	DB -- JSON --> FEResp
	class Doc2AI internal-link;
```

### Rubric generation
Need to model this new flow

## System architecture

```mermaid
flowchart
	subgraph DockerDB[MySQL container]
		DB[MySQL database]
	end
	subgraph DockerBE[Backend container]
		subgraph AuthBE[Authentication Module]
			ABEAPI[API]
			ABEKey[Auth keys]
		end
		subgraph AIProc[AI process]
			AI[AI team logic]
			AIKey[AI API Keys]
		end
		Prisma[Database ORM]
		File[File Storage]
		ConvProc[Data Conversion process]
	end
	subgraph DockerFE[Frontend container]
		subgraph AuthFE[Authentication Middleware]
			AFEAPI[API]
		end
		FEserve[Frontend server]
	end
	subgraph SSO[SSO servers]
		A0[Auth0]
		Ok[Okta Verify]
	end
	AuthBE <--Register Tokens--> SSO
	subgraph AIsys[LLM API]
	end
	ABEAPI --> Prisma
	File <--> Prisma
	ABEAPI --> AIProc
	AIProc <--AI connection--> AIsys
	Prisma <--Query / Access--> DB
	FEserve --Serves--> ClientA[Client] --Logs on using--> SSO
	FEserve --Serves--> ClientB[Client] --Logs on using--> SSO
	FEserve --Serves--> ClientC[Client] --Logs on using--> SSO
	AuthBE --defines--> AuthFE
	FEserve --Redirects-->  AFEAPI
	AFEAPI --Authenication / Authorisation--> FEserve
	AFEAPI <--data / requests--> ABEAPI
```
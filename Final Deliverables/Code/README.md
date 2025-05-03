TBD
Project: MINARMARKET-MERN STACK WITH NEXT.JS


SPRINT-1 SUBMISSION GUIDELINES

1. Properly tested working system deployed on an online hosting platform.
2. Code with readable comments uploaded in “Development/Sprint-4” folder of your project’s Github repository.
3. 3-4 minutes video that explains the functionality of your system developed so far. This must be uploaded in “Sprint-1” folder of your project’s Github repository.
4. Updated architecture and data model must be uploaded in the respective folders on Github.
5. Test case execution report. 
6. Update project schedule.  
7. This "Readme" file must be uploaded in Sprint-1 folder. 



------------------------------------------------------------------------------------------------

LIST OF REQUIREMENTS COMPLETED IN THE SPRINT


<List down use cases completed in the current sprint>

Revamping the UI/UX of whole website
Adding an AI recommendation system. The user is shown the categories according to their searches.
Adding a chat feature. When the seller accept the buyer query they can chat with them. Chat is through sockets and is a realtime chat




------------------------------------------------------------------------------------------------


LIST OF REQUIREMENTS COMPLETED SO FAR

<List down use cases completed so far including those in the previous sprints>

Seller can add the product and service they want to sell
Seller can edit the listing
Buyer can list the product and service requirement 
Buyer can edit their listing
Buyer can reach out to seller for product or service
Seller can accept or reject the buyers reach out
Seller can sell the proposal to buyer against their listings
Buyer can accept or reject the proposal
Revamping the UI/UX of whole website
Adding an AI recommendation system. The user is shown the categories according to their searches.
Adding a chat feature. When the seller accept the buyer query they can chat with them. Chat is through sockets and is a realtime chat

*Key Contributions*

*   *NLP & Vector Search Implementation:*
    *   Implemented core features for vector search, including embedding generation for products and services using a transformer model (00234eb, e3e7fb3).
    *   Created backend components: SearchController, embeddingMiddleware, embeddingService, vectorSearch utility (e3e7fb3).
    *   Developed frontend components: SearchPage, SearchBar with debouncing (e3e7fb3).
    *   Integrated user search query storage and enhanced search functionality across controllers/components (a3dc35c, bcc9796).
    *   Refactored search implementation details (e.g., commenting out storage 8c4bc77, standardizing imports 22fa6c3).
    *   Merged multiple Pull Requests related to the "NLP search bar" (d02e340, c4b7696, 20ff218, cfd1751, 376991f).

     *Frontend Development & Refactoring:*
    *   Refactored SiteHeader, created new public pages for Products and Services with visit recording, filtering, sorting, and animations (4ee792d).
    *   Updated navigation links (added /app prefix) (0bc2e3c).
    *   Enhanced user type and token state management using localStorage and migrated the library (7d00e82, ee49ffd, ff8efb0, dd00404).
    *   Implemented product and service grids with category filtering (f4b9b6a).
    *   Added image upload functionality for buyer requirements and services (227d7ef).
    *   Cleaned up frontend code (removed unused logic/components, fixed encoding issues) (f1a6bda, b706435, cfbb5ea, d1460ce, ea59449, 74cd9ab).

*   *Backend Development:*
    *   Added complaints and account status fields to the User schema (ca2657c).
    *   Implemented functionality to fetch and display approved buyer service requirements (e0daf55).
    *   Integrated embedding generation into Product/Service listing controllers and models (00234eb).

*   *Project Maintenance & Integration:*
    *   Managed dependencies (use-debounce, updated package-lock.json) (6d69ac1, 01b0a7f, e3e7fb3).
    *   Performed housekeeping tasks (removed tsconfig.json, possibly updated .gitignore for node_modules) (5142f2d, d473c1e).
    *   Resolved merge conflicts (01b0a7f).
    *   Merged numerous pull requests and branches, integrating features like the chat implementation, NLP search, and various bug fixes (d02e340, 344bc5a, dcc0ea2, c4b7696, 20ff218, cfd1751, 376991f, aba80a1, d2c3560, f22232a, c0ef50d, 4774629).




------------------------------------------------------------------------------------------------

HOW TO ACCESS THE SYSTEM

<Specify how your system can be accessed including URLs, user credentials etc.>

https://minarmarket.com/

*Sign in as a user*
email: abdulahad7553@gmail.com
pass: 1122@1122

*Sign in as a admin*
email: khurrum@gmail.com
pass: 1122@1122




------------------------------------------------------------------------------------------------



ADDITIONAL INFORMATION

<Any additional information that you would like me to know>




---


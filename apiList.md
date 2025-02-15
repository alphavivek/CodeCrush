# CodeCrush APIs

## authRouter
- POST /signup
- POST /login
- POST /logout


## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password


## connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId

+ POST (/request/send/:status/:userId) 

- POST /request/review/rejected/:requestId
- POST /request/review/accepted/:requestId

+ POST(/request/review/:status/:requestId)


## userRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed  -- Gets you the profiles of other users on platform

##
Status - ignored, rejected, interested, accepted
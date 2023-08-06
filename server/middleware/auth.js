import jwt from "jsonwebtoken";

//This function is used during an api route to check if usewr is logged in or not
// And based on that it will allow user to access a webpage
export const verifyToken = async (req, res, next) => {
    try {
        //From the req made in frontend we are grabbing Authorization
        let token = req.header("Authorization");

        //If token doesn't exist
        if(!token){
            return res.status(403).send("Access Denied");
        }

        //If token is starting with "Bearer", we remove it to get the actual token
        if(token.startsWith("Bearer "))
        {
            token = token.slice(7, token.length).trimLeft(); 
        }

        //Now verify the token using our secret string 
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        //This moves on with the rest of the logic of a api route
        next();
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
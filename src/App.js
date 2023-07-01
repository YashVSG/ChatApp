import { useEffect, useRef, useState } from "react";
import { Box, Button, Container, HStack, Input, VStack } from "@chakra-ui/react";
import Message from "./component/Message";
import {app} from "./firebase"
import {onAuthStateChanged, getAuth , GoogleAuthProvider,signInWithPopup,signOut} from "firebase/auth"
import {getFirestore,addDoc, collection, serverTimestamp, onSnapshot,query,orderBy} from "firebase/firestore"

const auth = getAuth(app)
const db = getFirestore(app);

const loginHandler = () => {

     const provider = new GoogleAuthProvider();
     signInWithPopup(auth,provider)
}
const logouthandler = () =>{
      
  signOut(auth)

}



function App() {
   
  
  const [user,setUser] = useState(false);
  const [message,setMessage] = useState("");
  const [messages,setMessages] = useState([]);
  // console.log(user);


  const divForScroll = useRef(null);

  const submithandler = async(e) => {
    e.preventDefault()

    try {
      setMessage("");          
     await addDoc(collection(db,"messages"),{
       text: message,
       uid : user.uid,
       uri : user.photoURL,
       createdAt: serverTimestamp(),
     });

     
     divForScroll.current.scrollIntoView({behaviour: "smooth"});
    }catch(error){
        alert(error);
    }
} 

  
  useEffect(()=>{
    const q = query(collection(db,"messages"),orderBy("createdAt","asc"))
    const unsubscribed = onAuthStateChanged(auth,(data)=>{
        // console.log(data); 
        setUser(data);
    });
    
    const unsubcribedForMessage = onSnapshot(q,(snap) => {

      setMessages(snap.docs.map((item) =>{
        const id = item.id;
        return {id,...item.data()};
      } )
      ) ;
    });

    return () => {
        unsubscribed();
        unsubcribedForMessage();
    };
  }, [])


  return (
    <Box bg={"red.100"}>
      {
        user?(
          <Container h={"100vh"} bg={"white"}>
        <VStack h={"full"} paddingY={4}>
          {/* VStack -> a div with display flex and flex direction column amd align items centre*/}
            
          <Button onClick={logouthandler} colorScheme={"red"} width={"full"}>
            Logout 
          </Button>

         <VStack 
         h = {"full"} 
         width ={"full"} 
         overflowY="auto" 
         css = {{"&::-webkit-scrollbar":{
            display:"none"
         }}}>
         {
            messages.map(item => (
              <Message
              key = {item.id} 
              user = {item.uid === user.uid? "me":"other"}
              text = {item.text} 
              uri ={item.uri}/>
            ))

         }
         <div ref ={divForScroll}></div>
         </VStack> 
          
          
         <form onSubmit={submithandler} style ={{width:"100%"}}>
          <HStack>
          <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter a Message...."/>
          <Button colorScheme="purple" type="submit"> Send</Button>
          </HStack>
         </form>

        </VStack>     
      </Container>
        ):<VStack justifyContent={"center"} h = {"100vh"}>

          <Button onClick={loginHandler}>Sign in with Google</Button>
        </VStack>
      }
    </Box>
  );
}

export default App;

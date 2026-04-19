package BillingSystem.Project.ExceptionHandler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;

public class GlobalExceptionHandler {
//    Product or category are what ever do not exist error
   @ExceptionHandler(NullPointerException.class)
    public ResponseEntity NullError(NullPointerException ex){
       ErrorResponce myError=new ErrorResponce(ex.getMessage(),"Not found");
       return new ResponseEntity<>(myError,HttpStatus.NOT_FOUND);

   }
//   General for all type of exception
   @ExceptionHandler(Exception.class)
    public ResponseEntity GeneralException(Exception e){

       ErrorResponce myError=new ErrorResponce(e.getMessage(),"Our Side issue from server");
       return new ResponseEntity<>(myError,HttpStatus.INTERNAL_SERVER_ERROR);

   }
   @ExceptionHandler(AlreadyExistsException.class)
    public ResponseEntity AlreadyExists(AlreadyExistsException ae){

       ErrorResponce myError=new ErrorResponce(ae.getMessage(),"Ye Product pehlay say mojood hai");
       return new ResponseEntity<>(myError,HttpStatus.CONFLICT);

   }
   @ExceptionHandler(MethodInputNotValid.class)
    public ResponseEntity EmptyField(MethodInputNotValid nv){

       ErrorResponce myError=new ErrorResponce(nv.getMessage(),"Field can not be empty");
       return new ResponseEntity<>(myError,HttpStatus.BAD_REQUEST);
   }


}

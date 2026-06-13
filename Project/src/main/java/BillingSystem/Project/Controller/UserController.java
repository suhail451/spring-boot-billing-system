package BillingSystem.Project.Controller;

import BillingSystem.Project.Service.UserService;
import BillingSystem.Project.SignupRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(
            @RequestBody SignupRequest request){

        userService.signup(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Account Created Successfully");
    }
}
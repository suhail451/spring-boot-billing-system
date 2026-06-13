package BillingSystem.Project.Service;

import BillingSystem.Project.Entity.User;
import BillingSystem.Project.Repositories.UserRepo;
import BillingSystem.Project.SignupRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    private final BCryptPasswordEncoder encoder =
            new BCryptPasswordEncoder();

    public void signup(SignupRequest request) {

        if(userRepo.findByUsername(request.getUsername()).isPresent()){
            throw new RuntimeException("Username already exists");
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setUsername(request.getUsername());

        user.setPassword(
                encoder.encode(request.getPassword())
        );

        userRepo.save(user);
    }
}
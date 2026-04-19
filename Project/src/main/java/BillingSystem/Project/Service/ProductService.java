package BillingSystem.Project.Service;


import BillingSystem.Project.Entity.Product;
import BillingSystem.Project.ExceptionHandler.AlreadyExistsException;
import BillingSystem.Project.ExceptionHandler.MethodInputNotValid;
import BillingSystem.Project.Repositories.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

// Get All products by search
@Autowired
private ProductRepo pr;

    public List<Product> search(String name){
        return pr.findByNameContainingIgnoreCaseAndIstrueTrue(name);
    }


//product ko delete krdo
    public void deleteProduct(Long id){
        Product product=pr.findById(id).orElseThrow(()-> new NullPointerException("Product with"+id+"not found for delete"));
        product.setIstrue(false);

        pr.save(product);


    }

//    get the list of all the products ;

    public List<Product> viewProducts(){

        return pr.findAllByIstrueTrue();
    }

    public Product addProduct(Product product) {
        if(product.getName()==null || product.getName().isEmpty()){
            throw new MethodInputNotValid("Atleast add one product name");
        }
        if(pr.existsByName(product.getName())){
            throw new AlreadyExistsException("Ye Product Pehlay say mojood hay.");
        }
        product.setIstrue(true);
        // Naya product hamesha active hona chahiye
        return pr.save(product);
    }





}

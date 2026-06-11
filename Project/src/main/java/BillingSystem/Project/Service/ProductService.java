package BillingSystem.Project.Service;


import BillingSystem.Project.Entity.Product;
import BillingSystem.Project.ExceptionHandler.AlreadyExistsException;
import BillingSystem.Project.ExceptionHandler.MethodInputNotValid;
import BillingSystem.Project.ExceptionHandler.ResourceNotFound;
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
        Product product=pr.findById(id).orElseThrow(()-> new ResourceNotFound("Product with"+id+"not found for delete"));
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

        Product existingProduct= pr.findByNameIgnoreCase(product.getName());
        if(existingProduct != null){
            if(existingProduct.getIstrue()==false){
                existingProduct.setIstrue(true);
               return pr.save(existingProduct);

            }
            else {
                throw new AlreadyExistsException("Product already exist");
            }

        }
        product.setIstrue(true);
        // Naya product hamesha active hona chahiye
        return pr.save(product);
    }





}

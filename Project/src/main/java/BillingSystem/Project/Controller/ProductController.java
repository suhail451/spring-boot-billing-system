package BillingSystem.Project.Controller;


import BillingSystem.Project.Entity.Product;
import BillingSystem.Project.Repositories.ProductRepo;
import BillingSystem.Project.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500") // CRITICAL: This allows your frontend to access the API

public class ProductController {

    @Autowired
    ProductService ps;
    @Autowired
    private ProductRepo pr;

    @GetMapping("view_all")
    public List<Product> viewALL(){

        return ps.viewProducts();

    }


// Search the product you want :
  @GetMapping("search/{name}")
  public List<Product> findbysearch(@PathVariable String name){

      return ps.search(name);

  }

//   Delete the product from list
    @DeleteMapping("delete/{id}")
    public String delete(@PathVariable Long id){

        ps.deleteProduct(id);


        return "Item deleted";

    }

    @PostMapping("addProduct")
    public Product newProduct(@RequestParam("name") String product_name){
        Product product = new Product(product_name);
        product.setName(product_name);

        ps.addProduct(product);

        return product;
        }


}

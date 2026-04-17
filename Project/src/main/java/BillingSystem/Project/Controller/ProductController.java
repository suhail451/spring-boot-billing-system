package BillingSystem.Project.Controller;


import BillingSystem.Project.Entity.Product;
import BillingSystem.Project.Repositories.ProductRepo;
import BillingSystem.Project.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500") // CRITICAL: This allows your frontend to access the API

public class ProductController {

    @Autowired
    ProductService ps;

    @GetMapping("view_all")
    public ResponseEntity<List<Product>> viewALL(){

        List<Product> myProducts=ps.viewProducts();
        return ResponseEntity.status(HttpStatus.OK).body(myProducts);

    }


// Search the product you want :
  @GetMapping("search/{name}")
  public ResponseEntity<List<Product>> findBySearch(@PathVariable String name){
      List<Product> mySearch=ps.search(name);
      if(mySearch.isEmpty()){
          return ResponseEntity.notFound().build();
      }
      return ResponseEntity.status(HttpStatus.OK).body(mySearch);

  }

//   Delete the product from list
    @DeleteMapping("delete/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id){

        ps.deleteProduct(id);

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();


    }

    @PostMapping("addProduct")
    public ResponseEntity<Product> newProduct(@RequestParam("name") String product_name){
        Product product = new Product(product_name);
        product.setName(product_name);

         Product myProduct = ps.addProduct(product);

        return ResponseEntity.status(HttpStatus.CREATED).body(myProduct);
        }


}

package BillingSystem.Project.Controller;


import BillingSystem.Project.BillItemRequest;
import BillingSystem.Project.Entity.BillItem;
import BillingSystem.Project.Repositories.BillRepo;
import BillingSystem.Project.Repositories.BillitemRepo;
import BillingSystem.Project.Service.BillItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Controller
@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500")

public class BillItemController {

@Autowired
private BillItemService bis;
@Autowired
private BillitemRepo bir;

    @PostMapping("/addItem")
    public String addItemToBill(@RequestBody BillItemRequest request) {

        // Now you can grab the IDs like this:
        Long bId = request.getBillId();
        Long pId = request.getProductId();
        Double pr = request.getPrice();

        // Pass them to your Service
        bis.createBillItem(bId, pId, pr);

        return "Item Added Automatically!";
    }

    @DeleteMapping("/delete_item/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable Long id){
        if(bis.deleteBillItem(id)) {
            return ResponseEntity.ok("item deleted");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Item not found");
        }
    }

    @PutMapping("Update_item/{id}")
    public void updateItemPrice(@PathVariable Long id,@RequestBody Double newPrice) throws Exception {


        bis.priceUpdate(id,newPrice);



    }



}

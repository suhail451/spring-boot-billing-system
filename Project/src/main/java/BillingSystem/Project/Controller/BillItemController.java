package BillingSystem.Project.Controller;

import BillingSystem.Project.BillItemRequest;
import BillingSystem.Project.Service.BillItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class BillItemController {

    @Autowired
    private BillItemService bis;

    @PostMapping("/addItem")
    public ResponseEntity<String> addItemToBill(@RequestBody BillItemRequest request) {
        Long bId = request.getBillId();
        Long pId = request.getProductId();
        Double pr = request.getPrice();
        bis.createBillItem(bId, pId, pr);
        return ResponseEntity.status(HttpStatus.CREATED).body("BillItem created in Bill id " + request.getBillId());
    }

    @DeleteMapping("/delete_item/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable Long id) {
        if (bis.deleteBillItem(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/Update_item/{id}")
    public ResponseEntity<String> updateItemPrice(@PathVariable Long id, @RequestBody Double newPrice) throws Exception {
        bis.priceUpdate(id, newPrice);
        return ResponseEntity.status(HttpStatus.OK).body("Updated Successfully");
    }
}
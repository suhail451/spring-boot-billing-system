package BillingSystem.Project.Service;


import BillingSystem.Project.Entity.Bill;
import BillingSystem.Project.Entity.BillItem;
import BillingSystem.Project.Entity.Product;
import BillingSystem.Project.Repositories.BillRepo;
import BillingSystem.Project.Repositories.BillitemRepo;
import BillingSystem.Project.Repositories.ProductRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BillItemService {

    @Autowired
    private BillRepo br;
    @Autowired
    private ProductRepo pr;
    @Autowired
    private BillitemRepo bl;
    @Autowired
    private BillService billservice;


    public void createBillItem(Long bill_id, Long product_id,Double price){
//        bill object ki id uthao or yaha lekr ao
        Bill bill = billservice.ShowBill(bill_id);

//        product ka object banao id find kro product ki uska uthao
        Product product=pr.findById(product_id).orElseThrow(() -> new RuntimeException("Product nahi mila bhi"));
//product par is true lagaya takai soft deleted product hamen na milain
        if(!product.getIstrue()){
            throw new RuntimeException("Ye product ('" + product.getName() + "') ab shop mein active nahi hai!");
        }

        //naya bill item bnao
        BillItem item=new BillItem();


//        bill item mn wo product jo us id par thi uska object dalo
//          bill b set kro or fir price b dalo

        item.setBill(bill);
        item.setProduct(product);
        item.setPrice(price);
//        ab us billItem ko save krlo

        bl.save(item);

    }


    @Transactional
    public Boolean deleteBillItem(Long billItemId) {
        return bl.findById(billItemId).map(item -> {
            // 1. Parent Bill se rishta khatam karo
            if (item.getBill() != null) {
                // Ab ye error nahi dega kyunke humne getBillItems() sahi likha hai
                item.getBill().getBillItems().remove(item);
            }
            // 2. Ab physically delete karo Repository se
            bl.delete(item);
            return true;
        }).orElse(false);
    }
    public void priceUpdate(Long BillItemID, Double newPrice) throws Exception {
        BillItem item=bl.findById(BillItemID).orElseThrow(()  -> new Exception("Item nahi mila"));

        item.setPrice(newPrice);

        bl.save(item);


    }

}

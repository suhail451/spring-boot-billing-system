package BillingSystem.Project.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table
public class BillItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double price;

    @JoinColumn
    @ManyToOne
    private Product product;
    @ManyToOne
    @JoinColumn(name = "bill_id")
    @JsonBackReference // Add this
    private Bill bill;


    public BillItem(Long id, Bill bill, Product product, double price) {
        this.id = id;
        this.bill = bill;
        this.product = product;
        this.price = price;



    }

    public BillItem() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Bill getBill() {
        return bill;
    }

    public void setBill(Bill bill) {
        this.bill = bill;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}

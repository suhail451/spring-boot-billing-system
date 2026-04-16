package BillingSystem.Project.Entity;

import jakarta.persistence.*;

@Entity
@Table
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Boolean istrue;

    // Product.java Entity class mein ye add karo:

    public Product() {
        // Ye khali hona chahiye
    }
    public Product(String product_name) {

    }




    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Boolean getIstrue() {
        return istrue;
    }

    public void setIstrue(Boolean istrue) {
        this.istrue = istrue;
    }

    public void setName(String name) {
        this.name = name;
    }

}

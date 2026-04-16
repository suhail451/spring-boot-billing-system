package BillingSystem.Project.Repositories;

import BillingSystem.Project.Entity.BillItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillitemRepo extends JpaRepository<BillItem,Long> {
}

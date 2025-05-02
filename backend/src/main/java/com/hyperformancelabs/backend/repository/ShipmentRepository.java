package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.Order;
import com.hyperformancelabs.backend.model.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Integer> {
    List<Shipment> findByOrder(Order order);


}

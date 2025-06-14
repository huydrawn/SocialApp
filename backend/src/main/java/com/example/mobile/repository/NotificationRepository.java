package com.example.mobile.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.mobile.model.Notification;
//đánh dấu lớp này là bean của spring và là một thành phần thuộc tầng repository của kiến trúc
//repo chịu trách nhiệm truy cập và thao tác với dữ liệu, thường là thông qua cơ sở dữ liệu
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    //jparepository là interface trong spring data jpa cung cấp các phương thức crud cơ bản
    //và các phương thức để thao tác với thực thể
    //Generics paramater: notification là loại thực thể mà repo này quản lý
    //Integer là kiểu của khóa chính của thực thể notification
    /**
     * Có sẵn một số phương thức
     * save(Notification notification)
     * findByID(Integer id)
     * findAll()
     * deleteID(Integer id)
     */
}

package ru.javamentor.rest313.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.javamentor.rest313.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
//    Optional<User> findByEmail(String email);
}

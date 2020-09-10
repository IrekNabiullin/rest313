package ru.javamentor.rest313.repository;

import org.springframework.stereotype.Repository;
import ru.javamentor.rest313.model.User;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
@SuppressWarnings("unchecked")
public class UserDaoImp implements UserDao {

    @PersistenceContext
    EntityManager entityManager;

    @Transactional
    @Override
    public List<User> listUsers() {
        return entityManager
                .createQuery("select u from User u", User.class)
                .getResultList();
    }

    @Transactional
    @Override
    public User getUserById(Long id) {
        return entityManager.find(User.class, id);
    }

    @Transactional
    @Override
    public User getUserByName(String username) {
        TypedQuery<User> query = entityManager.createQuery(
                "SELECT u FROM User u WHERE u.login = :username", User.class);
        User user = null;
        try {
            User userTemp = query.setParameter("username", username)
                    .getSingleResult();
            System.out.println("Got user. User name:" + userTemp.getLogin());
            if (userTemp != null) {
                return userTemp;
            } else {
                return null;
            }
        } catch (javax.persistence.NoResultException ex) {
            System.out.println("No user with name " + username + " found");
            return null;
        }
    }

    @Transactional
    @Override
    public void addUser(User user) {

        if (getUserByName(user.getLogin()) != null) {
            System.out.println("User with login " + user.getLogin() + "exists");
        } else if (user.getId() == null) {
            entityManager.persist(user);
        } else {
            entityManager.merge(user);
            System.out.println("Updating existing user");
        }
        System.out.println("User saved with id: " + user.getId());
    }

    @Transactional
    @Override
    public void updateUser(User user) {
        entityManager.merge(user);
        System.out.println("Updating existing user");
    }

    @Transactional
    @Override
    public void deleteUser(Long id) {
        User user = getUserById(id);
        User mergedContact = entityManager.merge(user);
        entityManager.remove(mergedContact);
        System.out.println("User with id: " + user.getId() + " deleted successfully");
    }

    @Transactional
    @Override
    public void deleteAllUsersFromTable() {
        String hql = "select u from User u";
        TypedQuery<User> query = entityManager.createNamedQuery(hql, User.class);
        List<User> users = query.getResultList();
        for (User user : users) {
            User mergedContact = entityManager.merge(user);
            entityManager.remove(mergedContact);
        }
    }
}

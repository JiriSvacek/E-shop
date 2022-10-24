package com.egeto.eshop;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ToDoItem {

    Connection connection;

    public ToDoItem(String url, String user, String password) throws SQLException {
        connection = DriverManager.getConnection(url, user, password);
    }

    public List<Item> loadItems(boolean available) throws SQLException {
        Statement statement = connection.createStatement();

        statement.executeQuery(availableDecision(available));

        ResultSet resultSet = statement.getResultSet();

        List<Item> resultList = new ArrayList<>();

        while (resultSet.next()) { resultList.add(createItem(resultSet));}

        return resultList;
    }

    private String availableDecision(boolean decision){
        if (decision) {
            return "SELECT * FROM item WHERE available = true";
        } else {
            return "SELECT * FROM item";
        }
    }

    public Item getByItemId(Integer id) throws SQLException {
        Statement statement = connection.createStatement();

        statement.executeQuery("SELECT * FROM item WHERE id = " + id);
        ResultSet resultSet = statement.getResultSet();
        if (resultSet.next()) { return createItem(resultSet);}
        return null;
    }

    private Item createItem(ResultSet resultSet) throws SQLException {
        Item item = new Item(
                resultSet.getInt("itemNb"),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getBigDecimal("price"),
                resultSet.getBoolean("available"));
        item.setId(resultSet.getInt("id"));

        return item;
    }

    public void insertNewItem(Item newItem) throws SQLException {
        Statement statement = connection.createStatement();
        int forSale = newItem.isForSale() ? 1 : 0; // boolean to tinyint
        statement.executeUpdate(
                "INSERT INTO item(itemNb, name, description, price, available) VALUES ('"
                        + newItem.getPartNumber() + "', '"
                        + newItem.getName() + "', '"
                        + newItem.getDescription() + "', '"
                        + newItem.getPrice() + "', '"
                        + forSale + "')",
                1);
    }

    public Integer updatePrice(Integer id, BigDecimal newPrice) throws SQLException {
        String updateData = "UPDATE item SET price = " + newPrice + " WHERE id = " + id;
        return updateTable(updateData);
    }

    public Integer deleteNotAviableItems() throws SQLException {
        String deleteData = "DELETE FROM item WHERE available = false";
        return updateTable(deleteData);
    }

    private Integer updateTable(String sqlCommand) throws SQLException {
        Statement statement = connection.createStatement();
        return statement.executeUpdate(sqlCommand);
    }
}

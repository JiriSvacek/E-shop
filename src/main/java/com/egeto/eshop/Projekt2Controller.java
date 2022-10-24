package com.egeto.eshop;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;


@CrossOrigin
@RestController
public class Projekt2Controller {

    static ToDoItem toDoItem;

    public Projekt2Controller() throws SQLException {
        toDoItem = new ToDoItem("jdbc:mysql://localhost:3306/projekt2", "projekt2", "projekt2_");
    }

    @ExceptionHandler
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleError(Exception e){
        return new ErrorResponse(e.getMessage(), LocalDateTime.now());
    }

    @GetMapping("/itemsLoad")
    public List<Item> getListItems(@RequestHeader("available") String available) throws SQLException {
        return toDoItem.loadItems(Boolean.parseBoolean(available));
    }

    @PostMapping("/newItem")
    public Item postItem(@RequestBody Item todoItem) throws SQLException {
        toDoItem.insertNewItem(todoItem);
        return todoItem;
    }

    @GetMapping("/loadItem/{id}")
    public Item getItemByPartNumber(@PathVariable("id") Integer id) throws SQLException {
        return toDoItem.getByItemId(id);
    }

    @PutMapping("/updatePrice")
    public Integer updatePriceOfItem(@RequestHeader("id") Integer id, @RequestHeader("price") BigDecimal price) throws SQLException {
        return toDoItem.updatePrice(id, price);
    }

    @DeleteMapping("/delete")
    public Integer deleteItem() throws SQLException {
        return toDoItem.deleteNotAviableItems();
    }

}

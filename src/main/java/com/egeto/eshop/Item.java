package com.egeto.eshop;

import java.math.BigDecimal;

public class Item {
    private int partNumber;
    private int id;
    private String name;
    private String description;
    private boolean forSale;
    private BigDecimal price;

    public Item(int partNumber, String name, String description, BigDecimal price, boolean forSale) {
        this.partNumber = partNumber;
        this.name = name;
        this.description = description;
        this.forSale = forSale;
        this.price = price;
    }

    public int getPartNumber() {
        return partNumber;
    }

    public void setPartId(int partNumber) {
        this.partNumber = partNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isForSale() {
        return forSale;
    }

    public void setForSale(boolean forSale) {
        this.forSale = forSale;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public int getId() {return id;}

    public void setId(int id) {this.id = id;}
}

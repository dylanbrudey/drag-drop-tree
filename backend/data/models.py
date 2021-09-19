from django.db import models


class City(models.Model):
    name = models.CharField(max_length=60)


class Brand(models.Model):
    name = models.CharField(max_length=60)


class Store(models.Model):
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    employee_count = models.IntegerField()

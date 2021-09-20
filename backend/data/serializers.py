from rest_framework import serializers
from data.models import Store, Brand, City


# Serializers define the API representation.


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name']


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name']


class StoreSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)
    brand = BrandSerializer(read_only=True)

    class Meta:
        model = Store
        fields = ['id', 'city', 'brand', 'employee_count']

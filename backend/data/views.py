from rest_framework import viewsets
from data.models import Store
from data.serializers import StoreSerializer


# ViewSets define the view behavior.
class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer

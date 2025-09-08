from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Todo
from .serializers import TodoSerializer

# class TodoViewSet(viewsets.ModelViewSet):
#     queryset = Todo.objects.all()
#     serializer_class = TodoSerializer

class TodoViewSet(viewsets.ModelViewSet):
    # queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only return todos for the current user
        return Todo.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Automatically set the user when creating a todo
        serializer.save(user=self.request.user)
from django.db import models
from django.contrib.auth.models import User

# Model for Todo items with a ForeignKey to the User model - Tush
class Todo(models.Model):
    # user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='todos')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    task = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email}: {self.task}"
# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import TodoViewSet

# router = DefaultRouter()
# router.register(r'todos', TodoViewSet)

# urlpatterns = [
#     path('api/', include(router.urls)),
# ]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TodoViewSet
from .auth_views import (
    login_view, register_view, logout_view, 
    user_profile, social_login_urls
)

router = DefaultRouter()
router.register(r'todos', TodoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', login_view, name='api_login'),
    path('auth/register/', register_view, name='api_register'),
    path('auth/logout/', logout_view, name='api_logout'),
    path('auth/user/', user_profile, name='api_user_profile'),
    path('auth/social-urls/', social_login_urls, name='social_login_urls'),
]
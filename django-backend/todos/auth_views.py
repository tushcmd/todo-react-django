# New - Tush 
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
import json

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return Response({
                'error': 'Email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Find user by email
        try:
            user = User.objects.get(email=email)
            user = authenticate(request, username=user.username, password=password)
        except User.DoesNotExist:
            user = None
            
        if user:
            login(request, user)
            tokens = get_tokens_for_user(user)
            return Response({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'name': user.get_full_name() or user.username,
                },
                'tokens': tokens
            })
        else:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        name = data.get('name', '')
        
        if not email or not password:
            return Response({
                'error': 'Email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            return Response({
                'error': 'User with this email already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create user
        user = User.objects.create_user(
            username=email,  # Use email as username
            email=email,
            password=password
        )
        
        if name:
            names = name.split(' ', 1)
            user.first_name = names[0]
            if len(names) > 1:
                user.last_name = names[1]
            user.save()
        
        login(request, user)
        tokens = get_tokens_for_user(user)
        
        return Response({
            'message': 'Registration successful',
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.get_full_name() or user.username,
            },
            'tokens': tokens
        })
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        logout(request)
        return Response({
            'message': 'Logout successful'
        })
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    return Response({
        'user': {
            'id': user.id,
            'email': user.email,
            'name': user.get_full_name() or user.username,
        }
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def social_login_urls(request):
    """Get social login URLs for frontend"""
    base_url = request.build_absolute_uri('/')[:-1]  # Remove trailing slash
    
    return Response({
        'github': f"{base_url}/accounts/github/login/",
        'google': f"{base_url}/accounts/google/login/",
    })
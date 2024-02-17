from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    
    # replace user_id with user_name on GET
    author = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author']
        read_only_fields = ('author',)

    def get_author(self, obj):
        return obj.author.username

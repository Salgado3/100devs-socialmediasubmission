 <section>
        <ul class="list-group ">
          <% for(let i =0; i <post.addComments.length; i++) {%>
          <li class='list-group-item eachComment montserrat'><%=post.addComments[i].theComments %>

            <% if(post.addComments[i].userId == user.id){ %>
            <form action="/post/deleteComment/<%=  post.id %>?_method=PUT" method="POST" class="col-3">
              <button class='btn btn-primary fa fa-trash col-xs-2' type='submit'></button></li>
          <% } %>
          <% } %>
        </ul>
      </section>


      
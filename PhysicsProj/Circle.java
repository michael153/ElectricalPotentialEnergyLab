
/* Sets up a Circle class which defines the syntax that
will be used to draw circles and defines the variables
involved in the process */

package PhysicsProj;

public class Circle
{
        int r;            //The radius
        int hit;
        int cx;
        int cy;
	int start_x;
	int start_y;
	int sx;
	int sy;

public Circle(int selected, int radius, int start_x, int start_y)
        {
        hit = selected;
	r = radius;
        cx = (start_x + r/2);
        cy = (start_y - r/2); 
	sx = start_x;
	sy = start_y;
        }
}
